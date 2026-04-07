import { useMemo } from 'react';
import { AgentCapabilities, EModelEndpoint, isAgentsEndpoint } from 'librechat-data-provider';

interface AgentCapabilitiesResult {
  toolsEnabled: boolean;
  actionsEnabled: boolean;
  artifactsEnabled: boolean;
  skillsEnabled: boolean;
  ocrEnabled: boolean;
  contextEnabled: boolean;
  fileSearchEnabled: boolean;
  webSearchEnabled: boolean;
  codeEnabled: boolean;
  deferredToolsEnabled: boolean;
  programmaticToolsEnabled: boolean;
}

interface UseAgentCapabilitiesOptions {
  capabilities?: AgentCapabilities[];
  endpoint?: string;
  agentsConfig?: {
    allowedProviders?: (string | EModelEndpoint)[];
    capabilities?: AgentCapabilities[];
  };
}

export default function useAgentCapabilities(
  options: UseAgentCapabilitiesOptions | AgentCapabilities[] | undefined,
): AgentCapabilitiesResult {
  // Handle backward compatibility - if options is an array, treat it as capabilities
  const capabilities = Array.isArray(options) ? options : options?.capabilities;
  const endpoint =
    typeof options === 'object' && !Array.isArray(options) ? options.endpoint : undefined;
  const agentsConfig =
    typeof options === 'object' && !Array.isArray(options) ? options.agentsConfig : undefined;

  // Check if the current endpoint supports agent capabilities
  const endpointSupportsAgents = useMemo(() => {
    if (!endpoint || !agentsConfig?.allowedProviders) {
      return false;
    }

    // If it's an agents endpoint, it always supports agents
    if (isAgentsEndpoint(endpoint)) {
      return true;
    }

    // Check if the endpoint is in the allowed providers list
    return agentsConfig.allowedProviders.some((provider) =>
      typeof provider === 'string' ? provider.toLowerCase() === endpoint.toLowerCase() : false,
    );
  }, [endpoint, agentsConfig?.allowedProviders]);

  // Use agent capabilities if endpoint supports agents, otherwise use provided capabilities
  const effectiveCapabilities = endpointSupportsAgents
    ? (agentsConfig?.capabilities ?? capabilities)
    : capabilities;
  const toolsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.tools) ?? false,
    [effectiveCapabilities],
  );

  const actionsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.actions) ?? false,
    [effectiveCapabilities],
  );

  const artifactsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.artifacts) ?? false,
    [effectiveCapabilities],
  );

  const skillsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.skills) ?? false,
    [effectiveCapabilities],
  );

  const ocrEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.ocr) ?? false,
    [effectiveCapabilities],
  );

  const contextEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.context) ?? false,
    [effectiveCapabilities],
  );

  const fileSearchEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.file_search) ?? false,
    [effectiveCapabilities],
  );

  const webSearchEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.web_search) ?? false,
    [effectiveCapabilities],
  );

  const codeEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.execute_code) ?? false,
    [effectiveCapabilities],
  );

  const deferredToolsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.deferred_tools) ?? false,
    [effectiveCapabilities],
  );

  const programmaticToolsEnabled = useMemo(
    () => effectiveCapabilities?.includes(AgentCapabilities.programmatic_tools) ?? false,
    [effectiveCapabilities],
  );

  return {
    ocrEnabled,
    codeEnabled,
    toolsEnabled,
    actionsEnabled,
    contextEnabled,
    artifactsEnabled,
    skillsEnabled,
    webSearchEnabled,
    fileSearchEnabled,
    deferredToolsEnabled,
    programmaticToolsEnabled,
  };
}
