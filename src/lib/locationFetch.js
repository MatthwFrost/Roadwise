import {  geofirestore, db } from './firebase';
import { GeoPoint } from 'firebase/firestore';

export function locationFetch(nearPos){
    const geocollection = geofirestore.collection('geolocation');
    const query = geocollection.near({ center: new GeoPoint(nearPos[0], nearPos[1]), radius: 1 });
    console.log(query);
    // Get query (as Promise)
    query.get().then(async (value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
        let data = value.docs;
        console.log(value.docs)

    for (const doc of data) {
        const data = doc.data();
        console.log(data);
        const routeId = data.locationRef;
        console.log(routeId);

        const routeDocRef = db.collection('routes').doc(routeId);
        const routeDocSnap = await routeDocRef.get();

        if (routeDocSnap.exists) {
            routeData = routeDocSnap.data();
            coords = routeData.routeCoords;  // Update coords for each route here
        } else {
            console.log("No such document!");
        }
    // Fetch data from another database using routeId
    }})
    return;
}


