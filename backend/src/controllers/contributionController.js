router.post('/', async (req, res) => {
  try {
    const { userId, userEmail, email, task, category, points, value } = req.body;
    
    // 1. "Name (email@dtu.ac.in)" format se exact email nikalo
    let searchEmail = email || userEmail;
    if (searchEmail && searchEmail.includes('(') && searchEmail.includes(')')) {
        searchEmail = searchEmail.split('(')[1].replace(')', '').trim();
    }

    // 2. Exact email ya userId se user dhoondho
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (searchEmail) {
      user = await User.findOne({ email: searchEmail });
    }

    const pointsToAdd = Number(points || value || 0);

    // 3. Contribution save karo
    const contribution = new Contribution({
      user: user ? user._id : null,
      task: task || 'Contribution',
      category: category || 'General',
      points: pointsToAdd,
      date: new Date()
    });
    await contribution.save();

    // 4. User ke points aur activityScore dono update karo (Jisse frontend par total dikhe)
    if (user) {
      user.points = (user.points || 0) + pointsToAdd;
      user.activityScore = (user.activityScore || 0) + pointsToAdd;
      await user.save();
    }

    return res.status(200).json({ success: true, message: 'Points transmitted successfully' });
  } catch (err) {
    console.error("Contribution Error:", err);
    return res.status(500).json({ message: err.message });
  }
});