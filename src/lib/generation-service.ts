/**
 * Provider-agnostic generation service.
 *
 * The app never talks to a model directly: it calls `generationService.generate`.
 * A real AI provider can be plugged in behind this interface later (through a
 * server function, so no API key ever reaches the browser). Until then the
 * deterministic generator in `records.ts` produces the draft from the user's
 * own answers only — it never invents legal facts.
 */
import { buildDraft, type GenerationInput, type GenerationOutput } from "./records";

export interface GenerationService {
  readonly id: string;
  generate(input: GenerationInput): Promise<GenerationOutput>;
}

function validate(output: GenerationOutput): GenerationOutput {
  if (!output.recordType || !Array.isArray(output.sections) || output.sections.length === 0) {
    throw new Error("The generated draft was not in the expected format.");
  }
  return output;
}

const deterministicService: GenerationService = {
  id: "deterministic-v1",
  async generate(input) {
    // Simulated latency keeps loading states honest in the UI.
    await new Promise((r) => setTimeout(r, 600));
    return validate(buildDraft(input));
  },
};

export const generationService: GenerationService = deterministicService;

export async function generateDraft(input: GenerationInput): Promise<GenerationOutput> {
  try {
    return await generationService.generate(input);
  } catch (error) {
    console.error("[generation]", error);
    throw new Error(
      "We could not generate the draft. Your answers have been preserved. Please try again.",
    );
  }
}
