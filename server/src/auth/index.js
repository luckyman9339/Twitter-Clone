import express from 'express';
import userDb from 'db/user';

export default () => {
  const router = express.Router();

  router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Email and Password are required.',
      });
    }

    const user = await userDb.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({
        error: 'No user found',
      });
    }

    const isPasswordValid = await userDb.verifyPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    // Login successfully!
    await new Promise(res => req.session.regenerate(res));
    req.session.userId = user.id;
    res.json({ message: 'Login successfully!' });
  });

  return router;
};
