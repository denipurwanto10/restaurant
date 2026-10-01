<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Dummy payment simulation. No real money is charged.
     */
    public function methods()
    {
        return PaymentMethod::where('is_active', true)
            ->orderBy('id')
            ->get(['code', 'name', 'type', 'account_number', 'account_name', 'instructions']);
    }

    public function show(Request $request, Payment $payment)
    {
        $payment->load(['method', 'order']);
        $this->authorizePayment($request, $payment);

        return new PaymentResource($payment);
    }

    /**
     * Guest demo simulation keyed by unguessable invoice number.
     * No sequential IDs are exposed for this flow.
     */
    public function simulateByInvoice(Request $request, string $invoice)
    {
        $request->validate([
            'result' => ['nullable', 'in:paid,failed'],
        ]);

        $payment = Payment::with(['method', 'order'])->where('invoice_number', $invoice)->firstOrFail();

        return $this->runSimulation($request->get('result', 'paid'), $payment);
    }

    public function simulate(Request $request, Payment $payment)
    {
        $request->validate([
            'result' => ['nullable', 'in:paid,failed'],
        ]);

        $payment->load(['method', 'order']);
        $this->authorizePayment($request, $payment);

        return $this->runSimulation($request->get('result', 'paid'), $payment);
    }

    private function runSimulation(string $result, Payment $payment)
    {
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Payment already processed.',
                'payment' => new PaymentResource($payment->fresh('method')),
            ], 422);
        }

        if ($payment->expires_at && $payment->expires_at->isPast()) {
            $payment->update(['status' => 'expired']);
            $payment->order->update(['payment_status' => 'expired']);

            return response()->json([
                'message' => 'Payment has expired.',
                'payment' => new PaymentResource($payment->fresh('method')),
            ], 422);
        }

        if ($result === 'failed') {
            $payment->update(['status' => 'failed']);
            $payment->order->update(['payment_status' => 'failed']);

            return response()->json([
                'message' => 'Demo payment marked as failed.',
                'payment' => new PaymentResource($payment->fresh('method')),
            ]);
        }

        $payment->update(['status' => 'paid', 'paid_at' => now()]);
        $payment->order->update(['payment_status' => 'paid', 'status' => 'confirmed']);

        return response()->json([
            'message' => 'Demo payment successful. No real money was charged.',
            'payment' => new PaymentResource($payment->fresh('method')),
        ]);
    }

    private function authorizePayment(Request $request, Payment $payment): void
    {
        if ($request->user()?->isAdmin()) {
            return;
        }
        $order = $payment->order;
        if ($request->user() && $order && $order->user_id === $request->user()->id) {
            return;
        }
        // Guest checkout flows must use the unguessable invoice endpoints
        // (lookup-by-invoice / simulate-by-invoice), never sequential IDs.
        abort(403, 'Not your payment.');
    }
}
