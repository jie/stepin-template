


export const getSessionInfo = () => {
    const session = localStorage.getItem('report_session');
    return session ? JSON.parse(session) : {};
}