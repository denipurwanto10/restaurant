<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BuildFrontend extends Command
{
    protected $signature = 'app:build-frontend';
    protected $description = 'Build frontend assets with Vite (stdio inherited)';

    public function handle(): int
    {
        $node = 'node';
        // Prefer Laragon-bundled node if available
        foreach (['C:\\Program Files\\nodejs\\node.exe'] as $candidate) {
            if (file_exists($candidate)) {
                $node = '"'.$candidate.'"';
                break;
            }
        }

        $cmd = 'cd '.escapeshellarg(base_path()).' && '.$node.' node_modules/vite/bin/vite.js build';
        $this->info('Running: '.$cmd);
        passthru($cmd, $exit);

        return (int) $exit;
    }
}
