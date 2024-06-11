
export function isRoleHasPermission(permissions: Array<string>, permission: string) {
  console.log('permissions:', permissions)
  if (permissions.includes("SYSTEM_ADMIN")) {
    return true
  }
  return permissions.includes(permission)
}

export function getUserPermissions() {
  let reportSession = localStorage.getItem("reim_session")
  if (!reportSession) {
    return []
  }
  reportSession = JSON.parse(reportSession)
  return reportSession?.user_data?.permission_keys || []
}
