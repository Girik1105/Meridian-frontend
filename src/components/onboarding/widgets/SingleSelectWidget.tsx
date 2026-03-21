"use client";

interface SingleSelectOption {
  label: string;
  description?: string;
}

interface SingleSelectWidgetProps {
  label: string;
  options: SingleSelectOption[];
  messageTemplate: (selected: string) => string;
  onSend: (text: string) => void;
}

export default function SingleSelectWidget({
  label,
  options,
  messageTemplate,
  onSend,
}: SingleSelectWidgetProps) {
  return (
    <div className="bg-white border border-silver/50 rounded-xl p-4 shadow-sm animate-fade-in-up">
      <p className="text-sm font-heading font-medium text-charcoal mb-3">{label}</p>

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => onSend(messageTemplate(option.label))}
            className="w-full text-left px-4 py-3 rounded-lg border border-silver/50 hover:border-secondary hover:ring-2 hover:ring-secondary/20 transition-all duration-200 group"
          >
            <span className="text-sm font-heading font-medium text-ink group-hover:text-primary transition-colors">
              {option.label}
            </span>
            {option.description && (
              <span className="block text-xs text-slate font-body mt-0.5">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
