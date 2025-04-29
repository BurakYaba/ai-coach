# Branch Code Implementation

## Overview

This document outlines the implementation of branch registration codes for school and branch management. The system works as follows:

1. System admin creates a school and branches
2. Each branch has a unique 6-digit registration code that is automatically generated
3. When a user registers, they can enter this 6-digit code to be associated with a specific branch
4. School admins who are assigned to specific branches can only see and manage students who belong to their branch

## Implementation Details

### Models

1. **Branch Model** (`src/models/Branch.ts`)

   - Already has a `registrationCode` field that generates a unique 6-digit code
   - Has a reference to its parent school
   - Has a list of branch admins

2. **User Model** (`src/models/User.ts`)
   - Has `school` and `branch` fields for association
   - School admins may be associated with a specific branch or with the whole school
   - Regular users will be associated with both a school and a branch when they register with a code

### Registration Process

1. The registration form (`src/components/auth/register-form.tsx`) allows users to enter a school code
2. The register API (`src/app/api/auth/register/route.ts`) looks up the branch by the registration code and associates the user with that branch and its parent school

### School Admin Filtering

1. The school admin student table (`src/components/school-admin/StudentTable.tsx`) now:

   - Shows branch registration codes in the branch filter dropdown
   - Defaults to showing only students from the admin's branch if they are a branch admin
   - Allows filtering students by branch

2. The students API (`src/app/api/schools/[id]/students/route.ts`) now:

   - Filters students by branch when a `branchId` parameter is provided
   - When creating new students, associates them with the admin's branch if they are a branch admin

3. The authentication system (`src/lib/auth.ts`) now:
   - Checks if a school admin is a branch admin
   - For branch admins, only allows them to manage students in their own branch

## Testing the Implementation

To test this implementation:

1. Create a school and branches as a system admin
2. Note the registration codes for each branch
3. Create school admin accounts and assign them to specific branches
4. Have users sign up using different branch codes
5. Log in as different school admins and verify they can only see and manage students from their own branch

## Future Enhancements

Potential future enhancements:

1. Add a "bulk upload" feature for students that automatically assigns them to the admin's branch
2. Add branch management capabilities for school admins
3. Implement email notifications when a user registers with a branch code
