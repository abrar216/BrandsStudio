<?php

namespace App\Services;

use App\Models\FeatureFlag;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class FeatureFlagService
{
    /**
     * Check if a feature is enabled.
     */
    public function isEnabled(string $name, ?User $user = null): bool
    {
        $flag = Cache::remember("feature_flag_{$name}", 3600, function () use ($name) {
            return FeatureFlag::where('name', $name)->first();
        });

        if (!$flag || !$flag->is_enabled) {
            return false;
        }

        // If no user provided, return global status
        if (!$user) {
            return $flag->is_enabled;
        }

        // If rules are defined, evaluate them
        if ($flag->rules) {
            return $this->evaluateRules($flag->rules, $user);
        }

        return true;
    }

    /**
     * Evaluate custom rules for a user.
     */
    protected function evaluateRules(array $rules, User $user): bool
    {
        if (isset($rules['admin_only']) && $rules['admin_only'] && !$user->is_admin) {
            return false;
        }

        if (isset($rules['user_ids']) && is_array($rules['user_ids'])) {
            return in_array($user->id, $rules['user_ids']);
        }

        return true;
    }
}
