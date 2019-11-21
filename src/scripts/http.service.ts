export interface Offer {
    icon: string;
    title: string;
    lead: string;
    linkUrl: string;
}

export async function getOffers(request: string) {
    return new Promise<Offer[]>(resolve => {
        return fetch(request)
            .then(response => response.json())
            .then(body => {
                console.log(body);
                resolve(body);
            });
    });
}