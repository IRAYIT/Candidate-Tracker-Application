// Renders a skills list as up to `visibleCount` skills followed by a
// "+N more" pill (full list available via title tooltip on the pill).
const renderSkillsCell = (skillStr, visibleCount = 3) => {
  const allSkills = skillStr
    ? skillStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const visible = allSkills.slice(0, visibleCount);
  const remaining = allSkills.length - visibleCount;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-gray-800 text-sm">
        {visible.join(", ")}
      </span>
      {remaining > 0 && (
        <span
          className="text-xs font-normal bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full"
          title={allSkills.slice(visibleCount).join(", ")}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
};

export const OPENINGCOLUMNS = (permissionid) => [
  { id: 'name',          header: 'OPENING NAME', accessorKey: 'name'          },
  {
    id: 'skill',
    header: 'SKILL',
    accessorKey: 'skill',
    cell: ({ getValue }) => renderSkillsCell(getValue(), 3),
  },
  { id: 'experience',    header: 'EXPERIENCE',   accessorKey: 'experience'    },
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
  { id: 'createdByName', header: 'RECRUITER',    accessorKey: 'createdByName' },
  { id: 'location',      header: 'LOCATION',     accessorKey: 'location'      },
  {
    id: 'candidateCount',
    header: 'APPLIED',
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