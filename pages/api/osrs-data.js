import axios from 'axios';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`);
    const data = response.data;

    const lines = data.split('\n');
    const skillLines = lines.slice(0, 24); // first 24 lines are skills
    const bossLines = lines.slice(35); // bosses start at line 36 (0-indexed)

    let totalXP = 0;
    for (let line of skillLines) {
      const parts = line.split(',');
      const xp = parseInt(parts[2], 10);
      if (!isNaN(xp)) {
        totalXP += xp;
      }
    }

    let totalBossKC = 0;
    for (let line of bossLines) {
      const parts = line.split(',');
      const kc = parseInt(parts[1], 10);
      if (!isNaN(kc) && kc > 0) {
        totalBossKC += kc;
      }
    }

    res.status(200).json({ totalXP, totalBossKC });
  } catch (error) {
    console.error('Hiscores fetch failed:', error);
    res.status(500).json({ error: 'Failed to fetch hiscore data' });
  }
}
