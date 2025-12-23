export const OPENINGCOLUMNS = [{
  id: 'name',
  header: 'OPENING NAME',
  accessorKey: 'name'
},
{
  id: 'technology',
  header: 'TECHNOLOGY',
  accessorKey: 'technology'
},
{
  id: 'skill',
  header: 'SKILL',
  accessorKey: 'skill'
},
{
  id: 'experience',
  header: 'EXPERIENCE',
  accessorKey: 'experience'
},
{
  id: 'status',
  header: 'STATUS',
  accessorKey: 'status'
}
]

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
    id: 'developer',
    header: 'DEVELOPER',
    accessorFn: (row) => row.resourceDto?.resourceName || 'N/A',
  },
  {
    id: 'technology',
    header: 'TECHNOLOGY',
    accessorKey: 'technology',
  },
  {
    id: 'skills',
    header: 'SKILLS',
    accessorKey: 'skills',
  },
  {
    id: 'status',
    header: 'STATUS',
    accessorKey: 'status',
  },
];
