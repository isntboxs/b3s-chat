"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

// --- Primitives ---

export type ModelSelectorProps = ComponentProps<typeof Dialog>;

export const ModelSelector = (props: ModelSelectorProps) => (
  <Dialog {...props} />
);

export type ModelSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const ModelSelectorTrigger = (props: ModelSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

export type ModelSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export const ModelSelectorContent = ({
  className,
  children,
  title = "Model Selector",
  ...props
}: ModelSelectorContentProps) => (
  <DialogContent className={cn("p-0", className)} {...props}>
    <DialogTitle className="sr-only">{title}</DialogTitle>
    <Command className="**:data-[slot=command-input-wrapper]:h-auto">
      {children}
    </Command>
  </DialogContent>
);

export type ModelSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export const ModelSelectorDialog = (props: ModelSelectorDialogProps) => (
  <CommandDialog {...props} />
);

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>;

export const ModelSelectorInput = ({
  className,
  ...props
}: ModelSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type ModelSelectorListProps = ComponentProps<typeof CommandList>;

export const ModelSelectorList = (props: ModelSelectorListProps) => (
  <CommandList {...props} />
);

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const ModelSelectorEmpty = (props: ModelSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const ModelSelectorGroup = (props: ModelSelectorGroupProps) => (
  <CommandGroup {...props} />
);

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>;

export const ModelSelectorItem = (props: ModelSelectorItemProps) => (
  <CommandItem {...props} />
);

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const ModelSelectorShortcut = (props: ModelSelectorShortcutProps) => (
  <CommandShortcut {...props} />
);

export type ModelSelectorSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const ModelSelectorSeparator = (props: ModelSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

export type ModelSelectorLogoProps = Omit<
  ComponentProps<"img">,
  "src" | "alt"
> & {
  provider:
    | "moonshotai-cn"
    | "lucidquery"
    | "moonshotai"
    | "zai-coding-plan"
    | "alibaba"
    | "xai"
    | "vultr"
    | "nvidia"
    | "upstage"
    | "groq"
    | "github-copilot"
    | "mistral"
    | "vercel"
    | "nebius"
    | "deepseek"
    | "alibaba-cn"
    | "google-vertex-anthropic"
    | "venice"
    | "chutes"
    | "cortecs"
    | "github-models"
    | "togetherai"
    | "azure"
    | "baseten"
    | "huggingface"
    | "opencode"
    | "fastrouter"
    | "google"
    | "google-vertex"
    | "cloudflare-workers-ai"
    | "inception"
    | "wandb"
    | "openai"
    | "zhipuai-coding-plan"
    | "perplexity"
    | "openrouter"
    | "zenmux"
    | "v0"
    | "iflowcn"
    | "synthetic"
    | "deepinfra"
    | "zhipuai"
    | "submodel"
    | "zai"
    | "inference"
    | "requesty"
    | "morph"
    | "lmstudio"
    | "anthropic"
    | "aihubmix"
    | "fireworks-ai"
    | "modelscope"
    | "llama"
    | "scaleway"
    | "amazon-bedrock"
    | "cerebras"
    | (string & {});
};

export const ModelSelectorLogo = ({
  provider,
  className,
  ...props
}: ModelSelectorLogoProps) => (
  <img
    {...props}
    alt={`${provider} logo`}
    className={cn("size-3 dark:invert", className)}
    height={12}
    src={`https://models.dev/logos/${provider}.svg`}
    width={12}
  />
);

export type ModelSelectorLogoGroupProps = ComponentProps<"div">;

export const ModelSelectorLogoGroup = ({
  className,
  ...props
}: ModelSelectorLogoGroupProps) => (
  <div
    className={cn(
      "-space-x-1 flex shrink-0 items-center [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
      className
    )}
    {...props}
  />
);

export type ModelSelectorNameProps = ComponentProps<"span">;

export const ModelSelectorName = ({
  className,
  ...props
}: ModelSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-left", className)} {...props} />
);

// --- Component Implementation ---

interface Model {
  id: string;
  name: string;
  provider: ModelSelectorLogoProps["provider"];
  description?: string;
}

const models: Model[] = [
  {
    id: "gemini-3-flash-preview:cloud",
    name: "Gemini 3 Flash",
    provider: "google",
    description: "Fastest cloud preview model",
  },
  {
    id: "kimi-k2-thinking:cloud",
    name: "Kimi K2 Thinking",
    provider: "moonshot",
    description: "Moonshot AI reasoning model",
  },
  {
    id: "qwen3-vl:235b-cloud",
    name: "Qwen3 VL 235B",
    provider: "alibaba",
    description: "Multi-modal visual language model",
  },
  {
    id: "nemotron-3-nano:30b-cloud",
    name: "Nemotron 3 Nano",
    provider: "nvidia",
    description: "Nvidia 30B cloud model",
  },
  {
    id: "gemini-3-pro-preview:latest",
    name: "Gemini 3 Pro",
    provider: "google",
    description: "Latest preview version",
  },
  {
    id: "gpt-oss:120b-cloud",
    name: "GPT-OSS 120B",
    provider: "openai",
    description: "Cloud hosted 120B model",
  },
  {
    id: "gpt-oss:20b-cloud",
    name: "GPT-OSS 20B",
    provider: "openai",
    description: "Cloud hosted 20B model",
  },
  {
    id: "devstral-2:123b-cloud",
    name: "Devstral 2 123B",
    provider: "mistral",
    description: "Cloud hosted Devstral model",
  },
];

export function AIModelSelector({
  value,
  onValueChange,
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string; // Add className prop to allow styling from parent
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(value || models[0].id);
  const selectedModel = models.find((m) => m.id === selectedId) || models[0];

  React.useEffect(() => {
    if (value) {
      setSelectedId(value);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onValueChange?.(id);
    setOpen(false);
  };

  // Sort models: selected model first, then the rest
  const sortedModels = React.useMemo(() => {
    const selected = models.find((m) => m.id === selectedId);
    const others = models.filter((m) => m.id !== selectedId);
    return selected ? [selected, ...others] : models;
  }, [selectedId]);

  return (
    <ModelSelector open={open} onOpenChange={setOpen}>
      <ModelSelectorTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between px-3 md:w-[200px]", className)}
        >
          <div className="flex items-center gap-2 truncate">
            <ModelSelectorLogo
              provider={selectedModel.provider}
              className="shrink-0 scale-125" // Increased scale slightly
            />
            <ModelSelectorName className="truncate">
              {selectedModel.name}
            </ModelSelectorName>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Select Model">
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorEmpty>No model found.</ModelSelectorEmpty>
        <ModelSelectorList>
          <ModelSelectorGroup heading="All Models">
            {sortedModels.map((model) => (
              <ModelSelectorItem
                key={model.id}
                value={model.name}
                onSelect={() => handleSelect(model.id)}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <ModelSelectorLogo provider={model.provider} className="size-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">
                        {model.description}
                      </span>
                    )}
                  </div>
                </div>
                {selectedId === model.id && <Check className="h-4 w-4" />}
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}
