import { useMemo } from 'react';
import { EModelEndpoint, AgentCapabilities, isAgentsEndpoint } from 'librechat-data-provider';
import type { TAgentsEndpoint, TEndpointsConfig } from 'librechat-data-provider';

interface UseEndpointCapabilitiesOptions {
  endpointsConfig?: TEndpointsConfig | null;
  endpoint?: string;
}

export default function useEndpointCapabilities({
  endpointsConfig,
  endpoint,
}: UseEndpointCapabilitiesOptions): {
  capabilities: AgentCapabilities[];
  agentsConfig?: TAgentsEndpoint | null;
} {
  const result = useMemo(() => {
    const agentsConfig: TAgentsEndpoint | null =
      (endpointsConfig?.[EModelEndpoint.agents] as TAgentsEndpoint | null) ?? null;

    // If no endpoint is provided, return agents capabilities
    if (!endpoint) {
      return {
        capabilities:
          agentsConfig?.capabilities?.map((cap) => cap as unknown as AgentCapabilities) ?? [],
        agentsConfig,
      };
    }

    // If it's an agents endpoint, use agents capabilities
    if (isAgentsEndpoint(endpoint)) {
      return {
        capabilities:
          agentsConfig?.capabilities?.map((cap) => cap as unknown as AgentCapabilities) ?? [],
        agentsConfig,
      };
    }

    // Check if the endpoint has its own capabilities
    const endpointConfig = endpointsConfig?.[endpoint];
    if (endpointConfig && typeof endpointConfig === 'object' && 'capabilities' in endpointConfig) {
      const endpointCapabilities = endpointConfig.capabilities as unknown[];
      if (Array.isArray(endpointCapabilities)) {
        return {
          capabilities: endpointCapabilities.map((cap) => cap as AgentCapabilities),
          agentsConfig,
        };
      }
    }

    // Check if the endpoint is in allowed providers and should inherit agent capabilities
    const allowedProviders = agentsConfig?.allowedProviders;
    if (allowedProviders && agentsConfig?.capabilities) {
      const isAllowedProvider = allowedProviders.some((provider) => {
        if (typeof provider === 'string') {
          return provider.toLowerCase() === endpoint.toLowerCase();
        }
        return false;
      });

      if (isAllowedProvider) {
        return {
          capabilities: agentsConfig.capabilities.map((cap) => cap as unknown as AgentCapabilities),
          agentsConfig,
        };
      }
    }

    // Default to empty capabilities
    return {
      capabilities: [],
      agentsConfig,
    };
  }, [endpointsConfig, endpoint]);

  return result;
}
