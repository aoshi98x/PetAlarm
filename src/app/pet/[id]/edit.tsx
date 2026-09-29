import { router, useLocalSearchParams } from 'expo-router';

import { AppHeader } from '@/components/AppHeader';
import { PetForm } from '@/components/PetForm';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updatePet } = useData();

  const pet = data.pets.find((p) => p.id === id);

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Editar mascota" back />
      {pet ? (
        <PetForm
          initial={pet}
          submitLabel="Guardar cambios"
          onSubmit={(input) => {
            updatePet(pet.id, input);
            router.back();
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}
