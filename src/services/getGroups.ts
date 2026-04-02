import 'dotenv/config'

export async function getGroups() {
    const url: string = 'https://baseservidor-evolution-api.kwlyqm.easypanel.host/group/fetchAllGroups/RD?getParticipants=false'

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EVOLUTION_API_KEY}`
            }
        })

        const data = await response.json()

        return data
    }
    catch (error) {
        console.error('Error fetching groups:', error)
        return []
    }
}
