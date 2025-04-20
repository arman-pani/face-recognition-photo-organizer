import { Expand } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Folder } from '../dataTypes';
import { getFolderById } from '../utils/folderMethods';




const GuestViewPage = ({ folderId, matchedUrls }: { folderId: string, matchedUrls: string[]}) => {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folderId) return;

    const fetchFolder = async () => {
      try {
        const data = await getFolderById(folderId);
        setFolder(data);
      } catch (err) {
        setError("Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderId]);

  if (loading) return <p className="text-gray-100">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!folder) return <p className="text-gray-100">Folder not found</p>;

  const formattedDate = new Date(folder.createdAt)
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(/(\d{1,2})/, (day) => {
      let suffix = 'th';
      if (day.endsWith('1') && day !== '11') suffix = 'st';
      if (day.endsWith('2') && day !== '12') suffix = 'nd';
      if (day.endsWith('3') && day !== '13') suffix = 'rd';
      return `${day}${suffix}`;
    });

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center border-b border-gray-800 pb-4 bg-gray-800 px-6 py-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">{folder.name}</h1>
          <p className="text-sm text-gray-400">
            {folder.client} | {folder.purpose}
          </p>
          <p className="text-xs text-gray-500">Created on {formattedDate}</p>
        </div>
      </div>

      {/* Photos Grid */}
      {folder.photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {matchedUrls.map((photo, index) => (
            <Card
              key={index}
              className="relative bg-gray-800 border border-gray-700"
            >
              <CardContent className="p-2 flex items-center justify-center">
                <img
                  src={photo}
                  alt={`photo-${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </CardContent>

              {/* Expand & Delete */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="text-gray-100 border-gray-700 hover:border-blue-400"
                >
                  <Expand size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-center text-gray-400">
          <p>
            Photos are not uploaded.{' '}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuestViewPage;
