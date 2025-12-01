import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { backendErrorMessage } from '../helpers/backendError';
import { uploadImage } from '../../shared/services/imageService';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageFile: null,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();



  const onValid = async (formData) => {

    try {
      let finalImageUrl = formData.imageUrl;

      // Si hay un archivo seleccionado (drag & drop o input file), lo subimos primero
      if (formData.imageFile) {
        try {
          const uploadRes = await uploadImage(formData.imageFile);
          finalImageUrl = uploadRes.url;
        } catch (uploadError) {
          console.error("Error uploading image", uploadError);
          setErrorBackendMessage('Error al subir la imagen. Intente nuevamente.');
          return;
        }
      }

      const payload = {
        sku: formData.sku,
        internalCode: formData.cui,
        name: formData.name,
        description: formData.description,
        currentUnitPrice: Number(formData.price),
        stockQuantity: Number(formData.stock),
        imageUrl: finalImageUrl,
      };

      await createProduct(payload);

      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.detail) {
        const errorMessage = backendErrorMessage[error.response.data.code];
        setErrorBackendMessage(errorMessage);
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <Card>
      <form
        className='
          flex
          flex-col
          gap-20
          p-8

          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input
          label='Descripción'
          {...register('description')}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            min: {
              value: 0,
              message: 'No puede tener un precio negativo',
            },
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
          })}
        />
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Imagen del Producto</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                setValue('imageFile', file); // Store the file for upload
                const reader = new FileReader();
                reader.onload = (event) => {
                  setValue('imageUrl', event.target.result); // Preview
                };
                reader.readAsDataURL(file);
              }
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setValue('imageFile', file); // Store the file for upload
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setValue('imageUrl', event.target.result); // Preview
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = ''; // Reset input so onChange fires again for same file
              }}
            />
            {watch('imageUrl') ? (
              <div className="relative w-full h-48">
                <img
                  src={watch('imageUrl')}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue('imageUrl', '');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1">Arrastra una imagen aquí o haz clic para seleccionar</p>
              </div>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500 uppercase">O ingresa una URL manualmente:</span>
            <Input
              {...register('imageUrl')}
              placeholder='https://ejemplo.com/imagen.jpg'
              className="mt-1"
            />
          </div>
        </div>
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>
        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form >
    </Card >
  );
};

export default CreateProductForm;
