
export function isRoleHasPermission(permissions: Array<string>, permission: string) {
  if (permissions.includes("SYSTEM_ADMIN")) {
    return true
  }
  return permissions.includes(permission)
}

export function getUserPermissions() {
  let reportSession = localStorage.getItem("report_session")
  if (!reportSession) {
    return []
  }
  reportSession = JSON.parse(reportSession)
  return reportSession?.user_data?.permission_keys
}
