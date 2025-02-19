export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { animal } = req.body;
  
    if (!animal) {
      return res.status(400).json({ error: 'Animal slug is required' });
    }
  
    const animals = {
      lion: { name: 'Lion', habitat: 'Savannah', diet: 'Carnivore' },
      tiger: { name: 'Tiger', habitat: 'Jungle', diet: 'Carnivore' },
      elephant: { name: 'Elephant', habitat: 'Grasslands', diet: 'Herbivore' },
      dolphin: { name: 'Dolphin', habitat: 'Ocean', diet: 'Carnivore' },
    };
  
    const animalData = animals[animal.toLowerCase()];
  
    if (!animalData) {
      return res.status(404).json({ error: 'Animal not found' });
    }
  
    return res.status(200).json(animalData);
  }
  