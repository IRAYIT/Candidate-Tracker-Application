// Escapes regex special characters in a raw search string.
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Wraps every case-insensitive occurrence of `query` inside `text` with a
// <mark> so it's visually highlighted. Returns the original text untouched
// if there's no query or nothing to render.
export const highlightMatch = (text, query) => {
  if (text === undefined || text === null || text === "") return text;
  const str = String(text);
  const trimmedQuery = query ? query.trim() : "";
  if (!trimmedQuery) return str;

  const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi");
  const parts = str.split(regex);

  if (parts.length === 1) return str;

  return parts.map((part, idx) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={idx} className="bg-yellow-200 text-inherit rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

// Renders a skills list as up to `visibleCount` skills followed by a
// "+N more" pill (full list available via title tooltip on the pill).
// Matching skills are highlighted when `query` is provided.
const renderSkillsCell = (skillStr, visibleCount = 3, query = "") => {
  const allSkills = skillStr
    ? skillStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const trimmedQuery = query ? query.trim().toLowerCase() : "";

  // When there's an active search, float matching skills to the front so
  // they land in the visible slice instead of getting buried behind the
  // "+N more" pill where the highlight would never be seen.
  let orderedSkills = allSkills;
  if (trimmedQuery) {
    const matching = allSkills.filter((s) => s.toLowerCase().includes(trimmedQuery));
    const nonMatching = allSkills.filter((s) => !s.toLowerCase().includes(trimmedQuery));
    orderedSkills = [...matching, ...nonMatching];
  }

  const visible = orderedSkills.slice(0, visibleCount);
  const hidden = orderedSkills.slice(visibleCount);
  const remaining = hidden.length;

  // If there are more matches than fit in the visible slice, some matches
  // are still hidden inside the pill — flag the pill itself so it's clear
  // a match is tucked away in there.
  const hiddenHasMatch = trimmedQuery && hidden.some((s) => s.toLowerCase().includes(trimmedQuery));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-gray-800 text-sm">
        {visible.map((skill, idx) => (
          <span key={idx}>
            {highlightMatch(skill, query)}
            {idx < visible.length - 1 ? ", " : ""}
          </span>
        ))}
      </span>
      {remaining > 0 && (
        <span
          className={`text-xs font-normal px-2 py-0.5 rounded-full ${
            hiddenHasMatch
              ? "bg-yellow-200 text-yellow-800 font-semibold"
              : "bg-gray-100 text-gray-400"
          }`}
          title={hidden.join(", ")}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
};

export const OPENINGCOLUMNS = (permissionid, searchQuery = "") => [
  {
    id: 'name',
    header: 'JOB TITLE',
    accessorKey: 'name',
    cell: ({ getValue }) => highlightMatch(getValue(), searchQuery),
  },
  {
    id: 'skill',
    header: 'REQUIRED SKILLS',
    accessorKey: 'skill',
    cell: ({ getValue }) => renderSkillsCell(getValue(), 3, searchQuery),
  },
  {
    id: 'experience',
    header: 'EXPERIENCE REQUIRED',
    accessorKey: 'experience',
    cell: ({ getValue }) => highlightMatch(getValue(), searchQuery),
  },
  { 
    id: 'status', 
    header: 'STATUS', 
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const status = getValue();
      if (status === "TERMINATED") return <span className="text-red-500 font-semibold">Closed</span>;
      if (status === "ACTIVE") return <span className="text-green-500 font-semibold">Active</span>;
      return status;
    }
  },
  {
    id: 'createdByName',
    header: 'RECRUITER NAME',
    accessorKey: 'createdByName',
    cell: ({ getValue }) => highlightMatch(getValue(), searchQuery),
  },
  {
    id: 'location',
    header: 'LOCATION',
    accessorKey: 'location',
    cell: ({ getValue }) => highlightMatch(getValue(), searchQuery),
  },
  {
    id: 'candidateCount',
    header: 'APPLICATIONS RECEIVED',
    accessorKey: 'candidateCount',
    cell: ({ row, getValue }) => {
      const count = getValue();
      if (permissionid === "4") {
        return (
          <span className="text-gray-700 font-semibold cursor-default">
            {count}
          </span>
        );
      }
      return (
        <span
          onClick={() => {
            localStorage.setItem("filter_opening_id", row.original.id);
            localStorage.setItem("filter_opening_name", row.original.name);
            window.location.href = "/applied-candidates";
          }}
          className="cursor-pointer text-blue-600 font-semibold hover:underline"
        >
          {count}
        </span>
      );
    }
  }
];

export const MANAGERESOURCECOLUMNS = [
  {
    id: 'firstName',
    header: 'FIRSTNAME',
    accessorKey: 'firstName',
  },
  {
    id: 'technology',
    header: 'TECHNOLOGY',
    accessorKey: 'technology',
  },
  {
    id: 'skill',
    header: 'SKILLS',
    accessorKey: 'skill',
    cell: ({ row }) => renderSkillsCell(row.original.skill, 3),
  },
  {
    id: 'experience',
    header: 'EXPERIENCE',
    accessorKey: 'experience',
  },
  {
    id: 'status',
    header: 'STATUS',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const status = getValue();
      if (status === "ACTIVE") return <span className="text-green-600 font-semibold">ACTIVE</span>;
      if (status === "TERMINATED") return <span className="text-red-500 font-semibold">TERMINATED</span>;
      return status;
    },
  },
];

export const PROJECTCOLUMNS = [
  {
    id: 'name',
    header: 'PROJECT NAME',
    accessorKey: 'name',
  },
  {
    id: 'technology',
    header: 'TECHNOLOGY',
    accessorFn: (row) => {
      const techs = (row.projectRoles || [])
        .map((r) => r.technology)
        .filter(Boolean);
      return [...new Set(techs)].join(', ') || 'N/A';
    },
  },
  {
    id: 'developers',
    header: 'DEVELOPERS',
    accessorFn: (row) => {
      const names = (row.projectRoles || [])
        .flatMap((r) => r.resourceNames || [])
        .filter(Boolean);
      return [...new Set(names)].join(', ') || 'N/A';
    },
  },
  {
    id: 'status',
    header: 'STATUS',
    accessorKey: 'status',
  },
];