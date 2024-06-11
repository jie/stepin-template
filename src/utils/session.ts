


export const getSessionInfo = () => {
    const session = localStorage.getItem('reim_session');
    return session ? JSON.parse(session) : {};
}