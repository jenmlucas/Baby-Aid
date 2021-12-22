const withAuth = (req, res, next) => {
    if (!req.session.parent_id) {
        res.redirect('/login');
        return
    } else {
        next();
    }
};

module.exports = withAuth;