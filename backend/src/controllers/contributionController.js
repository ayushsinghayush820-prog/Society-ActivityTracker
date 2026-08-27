router.post('/', async (req, res) => {
  try {
    const { userId, userEmail, email, task, category, points, value } = req.body;
    
    // User dhoondho chahe ID se ho ya Email se
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email || userEmail) {
      user = await User.findOne({ email: email || userEmail });
    }

    const pointsToAdd = Number(points || value || 0);

    // Contribution save karo
    const contribution = new Contribution({
      user: user ? user._id : null,
      task: task || 'Contribution',
      category: category || 'General',
      points: pointsToAdd,
      date: new Date()
    });
    await contribution.save();

    // User ke points update karo agar user mila
    if (user) {
      user.points = (user.points || 0) + pointsToAdd;
      await user.save();
    }

    return res.status(200).json({ success: true, message: 'Points transmitted successfully' });
  } catch (err) {
    console.error("Contribution Error:", err);
    return res.status(500).json({ message: err.message });
  }
});