import { router } from 'expo-router';

import { AppHeader } from '@/components/AppHeader';
import { PetForm } from '@/components/PetForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';

export default function NewPetScreen() {
  const { addPet } = useData();

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Nueva mascota" subtitle="Añade un perro o un gato" back />
      <PetForm
        onSubmit={(input) => {
          const pet = addPet(input);
          router.replace({ pathname: '/pet/[id]', params: { id: pet.id } });
        }}
      />
    </ScreenContainer>
  );
}
