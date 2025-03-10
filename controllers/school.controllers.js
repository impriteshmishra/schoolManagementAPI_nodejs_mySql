

export const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }


        const db = req.app.locals.db;
        if (!db) {
            return res.status(500).json({ message: "Database connection not available" });
        }


        const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(query, [name, address, latitude, longitude]);

        return res.status(201).json({ message: "School added successfully", schoolId: result.insertId });


    } catch (error) {
        console.log("Error while adding school");

    }
}


//here i implemented haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; //radius of earth
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //distance in km 
};

export const listSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "latitude and longitude both are required" });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        const db = req.app.locals.db;

        const [results] = await db.query("SELECT * FROM schools")


        const sortedSchools = results
            .map((school) => ({
                ...school,
                distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
            }))
            .sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        console.log("error while listining school", error);

    }
}