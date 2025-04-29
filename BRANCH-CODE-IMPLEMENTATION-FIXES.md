# Branch Code Implementation - Fixes

## Issue Summary

The branch code implementation was not functioning correctly. Branch-specific school admins were able to see all students in the school regardless of which branch they belonged to. The system needed to be fixed so that:

1. Branch admins should only see and manage students from their specific branch
2. Branch filter should be hidden for branch admins as they should only see their own branch's students
3. The UI should clearly indicate which branch a school admin is managing

## Implemented Fixes

### 1. Fixed Authorization Logic in `src/lib/auth.ts`

The `canManageStudent` function was updated to ensure branch admins can only manage students in their specific branch:

```javascript
// If manager is associated with a branch, they should ONLY manage students in their branch
if (manager.branch) {
  return student.branch?.toString() === manager.branch.toString();
}
```

### 2. Updated API Endpoint in `src/app/api/schools/[id]/students/route.ts`

The GET endpoint was modified to automatically filter by the admin's branch:

```javascript
// Get the current user to check if they're a branch admin
const admin = await User.findById(session.user.id);

// If admin is associated with a branch, automatically filter by that branch
if (admin?.role === "school_admin" && admin.branch) {
  // Branch admins should only see students from their branch
  query.branch = admin.branch;
} else {
  // For school-wide admins or system admins, respect the branch filter if provided
  const branchId = searchParams.get("branchId");
  if (branchId && branchId !== "all") {
    query.branch = branchId;
  }
}
```

The API also now returns an `isBranchAdmin` flag to tell the frontend whether the current user is a branch admin.

### 3. Updated UI in `src/components/school-admin/StudentTable.tsx`

The UI was updated to:

1. Hide the branch filter dropdown for branch admins
2. Clearly display which branch a school admin is managing
3. Send the correct query parameters when fetching students

```javascript
<CardDescription>
  {school
    ? isBranchAdmin && currentBranch
      ? `Manage students for ${currentBranch.name} Branch (Code: ${currentBranch.registrationCode})`
      : `Manage students for ${school.name}`
    : "Loading..."}
</CardDescription>
```

```javascript
{
  /* Only show branch filter for school-wide admins, not for branch admins */
}
{
  !isBranchAdmin && (
    <div className="flex flex-col gap-2">
      <Label htmlFor="branch-select">Filter by Branch</Label>
      <Select value={selectedBranch} onValueChange={handleBranchChange}>
        {/* ... dropdown content ... */}
      </Select>
    </div>
  );
}
```

## Testing

To verify these fixes:

1. Log in as a branch-specific school admin
2. Confirm that only students from their branch are displayed
3. Confirm that the branch filter is not shown
4. Log in as a school-wide admin (without branch affiliation)
5. Confirm they can see all students and filter by branch

## Flow Summary

The complete flow now works as intended:

1. System admin creates schools and branches with unique six-digit codes
2. System admin creates school admin accounts, selecting which school and branch they belong to
3. When a user signs up, they enter a six-digit unique code which associates them with a specific branch
4. School admins can only see and manage users that match their branch assignment
   - Branch-specific admins only see their branch's students (no filter option needed)
   - School-wide admins can see all students and filter by branch
