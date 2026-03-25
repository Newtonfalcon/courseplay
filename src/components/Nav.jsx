import { NavLink } from "react-router-dom";
import {
  FaBook,
  FaPlay,
  FaPlusCircle,
  FaUserCircle,
  FaCode,
} from "react-icons/fa";
import {ROUTES} from '../libs/constants'

const NAV_ITEMS = [
  { id: "courses", label: "Courses", icon: FaBook,       href: ROUTES.dashboard },
  { id: "learn",   label: "Learn",   icon: FaPlay,       href: ROUTES.learn   },
  { id: "create",  label: "Create",  icon: FaPlusCircle, href: ROUTES.createCourse,  highlight: true },
  { id: "profile", label: "Profile", icon: FaUserCircle, href: ROUTES.profile  },
  { id: "code",    label: "Code",    icon: FaCode,       href: ROUTES.code    },
];

export default function BottomNav() {
  return (
    <>
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          flex items-center justify-around
          bg-black border-t border-white/[0.06]
          px-2 pt-2
          pb-[env(safe-area-inset-bottom,0px)]
          md:pb-2
          md:bottom-5 md:left-1/2 md:-translate-x-1/2
          md:w-auto md:rounded-2xl
          md:border md:border-white/[0.08]
          md:px-3 md:py-2
          md:gap-1
          md:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
          md:backdrop-blur-md
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0
          after:h-[env(safe-area-inset-bottom,20px)] after:bg-black after:translate-y-full
          after:md:hidden
        "
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>
      <div className="h-16 md:h-0" />
    </>
  );
}

function NavItem({ item }) {
  const Icon = item.icon;

  if (item.highlight) {
    return (
      <NavLink
        to={item.href}
        aria-label={item.label}
        className="
          relative flex flex-col items-center justify-center gap-1
          cursor-pointer select-none outline-none group
          flex-1 py-1
          md:flex-none md:flex-row md:gap-2
          md:px-5 md:py-2.5 md:rounded-xl
          bg-purple-600/90 hover:bg-purple-500
          rounded-xl transition-all duration-200
          shadow-[0_0_18px_rgba(147,51,234,0.45)]
          hover:shadow-[0_0_24px_rgba(147,51,234,0.65)]
          active:scale-95
        "
      >
        <Icon className="text-white text-lg md:text-base shrink-0" />
        <span className="text-white text-[10px] font-bold tracking-wide md:text-sm md:font-semibold">
          {item.label}
        </span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.href}
      aria-label={item.label}
      className={({ isActive }) => `
        relative flex flex-col items-center justify-center gap-1
        cursor-pointer select-none outline-none group
        transition-all duration-200 active:scale-95
        flex-1 py-1
        md:flex-none md:flex-row md:gap-2
        md:px-5 md:py-2.5 md:rounded-xl
        md:hover:bg-white/[0.07]
        ${isActive ? "md:bg-purple-500/[0.15] md:border md:border-purple-500/20 md:rounded-xl" : ""}
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="
              absolute top-0 left-1/2 -translate-x-1/2
              w-5 h-0.5 rounded-full bg-purple-500
              md:hidden
            " />
          )}
          <Icon
            className={`
              text-lg md:text-base shrink-0
              transition-all duration-200
              ${isActive
                ? "text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.7)]"
                : "text-white/50 group-hover:text-white/80"
              }
            `}
          />
          <span
            className={`
              text-[10px] font-semibold tracking-wide
              md:text-sm md:font-medium
              transition-colors duration-200
              ${isActive
                ? "text-purple-400"
                : "text-white/50 group-hover:text-white/80"
              }
            `}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}