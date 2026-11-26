// Universal links for the LotusMLS iPhone app (com.lotusmls.app, team U839H3VG3X):
// listing and agent pages on this site open in the app when it is installed.
// The app maps /listing/<slug> and /agent/<slug> (all four MLS sites share listing slugs).
// Served as a route so it is application/json with no file extension, as Apple requires.
export const dynamic = 'force-static';

const AASA = {
  applinks: {
    details: [{
      appIDs: ['U839H3VG3X.com.lotusmls.app'],
      components: [
        { '/': '/listing/*' }, { '/': '/vi/listing/*' }, { '/': '/ko/listing/*' }, { '/': '/ru/listing/*' },
        { '/': '/agent/*' }, { '/': '/vi/moi-gioi/*' }, { '/': '/ko/agent/*' }, { '/': '/ru/agent/*' },
      ],
    }],
  },
};

export function GET() {
  return Response.json(AASA, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
