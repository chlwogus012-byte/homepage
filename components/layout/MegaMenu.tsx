import type { NavItem } from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { NavLink } from "@/components/ui/NavLink";

type MegaMenuProps = {
  navigation: NavItem[];
  open: boolean;
  onNavigate: () => void;
};

export function MegaMenu({ navigation, open, onNavigate }: MegaMenuProps) {
  return (
    <div
      role="menu"
      aria-hidden={!open}
      className={`absolute inset-x-0 top-full border-t border-border bg-surface shadow-lg transition-opacity duration-150 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className="mx-auto grid gap-8 px-6 py-10"
        style={{
          maxWidth: "var(--container-max)",
          gridTemplateColumns: `repeat(${navigation.length}, minmax(0, 1fr))`,
        }}
      >
        {navigation.map((item) => (
          <div key={item.label}>
            <NavLink
              href={item.href}
              onClick={onNavigate}
              className="text-base font-semibold text-text hover:text-primary"
            >
              {item.label}
              {item.badge ? <Badge>N</Badge> : null}
            </NavLink>
            {item.children && item.children.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {item.children.map((child) => (
                  <li key={child.label}>
                    <NavLink
                      href={child.href}
                      onClick={onNavigate}
                      className="text-sm text-text-muted hover:text-text"
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
