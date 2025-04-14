import axios from 'axios';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.imageURL; // Ví dụ: /uploads/171312312-image.png
};

export default uploadFile;
