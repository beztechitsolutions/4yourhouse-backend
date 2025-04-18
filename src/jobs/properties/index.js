import cron from 'node-cron';
import getProperties from './getProperties.js';
import getPropertyMedia from './getPropertyMedia.js';
import Properties from '../../models/property.model.js';

const CRON_SCHEDULE = '0 0 * * *'; // Every day at 12:00 AM

async function getLastModifiedDate() {
    const lastProperty = await Properties
        .findOne({ 'json.modified': { $exists: true } })
        .sort({ 'json.modified': -1 });
    return lastProperty
        ? new Date(lastProperty.json.modified).toISOString()
        : new Date(0).toISOString(); // Default to oldest date if none found
}

async function processListing(listing) {
    try {
        const exists = await Properties.findOne({ listingKey: listing.ListingKey });
        if (exists) return;

        const media = await getPropertyMedia(listing.ListingKey);
        await Properties.create({
            listingKey: listing.ListingKey,
            json: {
                ...listing,
                media,
                modified: listing.ModificationTimestamp,
            }
        });

        console.log(`✅ Created property: ${listing.ListingKey}`);
    } catch (err) {
        console.error(`❌ Failed to process listing ${listing.ListingKey}:`, err.message);
    }
}

async function fetchAndSaveProperties() {
    try {
        let lastModifiedDate = await getLastModifiedDate();
        let skip = 0;
        const limit = 100;

        while (true) {
            const url = `/Property?$top=${limit}&$skip=${skip}&$filter=ModificationTimestamp gt ${lastModifiedDate}&$orderby=ModificationTimestamp asc`;
            const propData = await getProperties('IDX', url);

            const listings = propData?.value || [];
            if (!listings.length) {
                console.log('ℹ️ No more properties found.');
                break;
            }

            for (const listing of listings) {
                await processListing(listing);
            }

            skip += limit;
        }

        console.log('🎉 Cron job cycle completed.');
    } catch (error) {
        console.error('🚨 Cron job failed:', error.message);
    }
}

function startPropertiesCronJob() {
    cron.schedule(CRON_SCHEDULE, fetchAndSaveProperties);
    console.log('🔁 Properties cron job scheduled.');
}

export default startPropertiesCronJob;