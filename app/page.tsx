import PhotoGallery from "./components/PhotoGallery";
import { getPhotos } from "./actions/getPhotos";

export default async function Home() {
  
  const response = await getPhotos(1)
  
  return (
    <PhotoGallery initialData={response?.results || []}/>
  );
}
  