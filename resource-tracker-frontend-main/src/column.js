export const OPENINGCOLUMNS = [
  { id: 'name',          header: 'OPENING NAME', accessorKey: 'name'          },
  { id: 'skill',         header: 'SKILL',        accessorKey: 'skill'         },
  { id: 'experience',    header: 'EXPERIENCE',   accessorKey: 'experience'    },
  { id: 'status',        header: 'STATUS',       accessorKey: 'status'        },
  { id: 'createdByName', header: 'RECRUITER',    accessorKey: 'createdByName' },
  { id: 'location',      header: 'LOCATION',     accessorKey: 'location'      },
  {
    id: 'candidateCount',
    header: 'APPLIED',
    accessorKey: 'candidateCount',
    cell: ({ row, getValue }) => {
      const count = getValue();
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