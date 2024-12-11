export const redirect = () => {
    if (location.pathname === '/') {
        location.href = "/main.html?study_id=pr215";
    }
};