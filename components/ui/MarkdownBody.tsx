import type { MarkdownBlock } from "@/lib/markdown";

type MarkdownBodyProps = {
  blocks: MarkdownBlock[];
};

export function MarkdownBody({ blocks }: MarkdownBodyProps) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h2" : "h3";
            return (
              <Tag
                key={index}
                className={
                  block.level === 2
                    ? "mt-4 text-lg font-semibold text-text md:text-xl"
                    : "mt-2 text-base font-semibold text-text"
                }
              >
                {block.text}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={index} className="border-l-2 border-primary pl-4 text-sm text-text-muted">
                {block.text}
              </blockquote>
            );
          case "list":
            return (
              <ul key={index} className="list-disc pl-5 text-sm text-text-muted">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "paragraph":
            return (
              <p key={index} className="text-sm text-text-muted">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
