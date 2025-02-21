import PocketBase from 'pocketbase'; 
const db = new PocketBase('http://127.0.0.1:8090');

export async function getOffres() {
    try {
        let data = await db.collection('maison').getFullList({
            sort: '-created',
        });
        data = data.map((event) => {
            event.imgUrl = db.files.getURL(event, event.image);
            return event;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
        return [];
    }
}


export async function getOffre(id) {
    try {
        let data = await db.collection('maison').getOne(id);
        data.imageUrl = db.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}


export async function bySurface(surface) {
    const records = await db.collection('Maison').getFullList({
        filter: `surface > ${surface}` , });
    return records;
    }


export async function addOffre(house) {
    try {
        await db.collection('maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await db.collection('maison').getFullList({
            sort: '-created',
            filter: `prix >= ${prixMin} && prix <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.imageUrl = db.files.getURL(maison, maison.image);
            return maison;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}

export async function allAgent() {
    try {
        let agents = await db.collection("agent").getFullList();
        console.log(agents);
        
        return agents
    } catch (error) {
        console.error("error allAgent: ", error);
        return null;
    }
}

export async function allEventsByAgent(agentId) {
    try {
        console.log("ok dans allEvent", agentId);
        
        let maisons = await db.collection("maison").getFullList({
            filter: `Agent = "${agentId}"`,
            expand: "Agent",
        });
        maisons = maisons.map((maison) => {
            maison.img = db.files.getURL(maison, maison.image);
            return maison;
        });
        console.log("les maisons",{maisons});
        
        return maisons;
    } catch (error) {
        console.error("error allEventsByAgent: ", error);
        return [];
    }
}

export async function setFavori(house) {
    await db.collection('maison').update(house.id, {favori: !house.favori});
}