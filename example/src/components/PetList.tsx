import { Pet } from "../../openapi/models/Pet";
import { PetService } from "../../openapi/services/PetService";
let data: Pet[] | undefined;

export const PetList = () => {
  if (data === undefined) {
    throw PetService.findPetsByStatus(["available"]).then((d) => (data = d));
  }

  return (
    <ul>
      {data.map((pet, index) => (
        <li key={index}>{pet.name}</li>
      ))}
    </ul>
  );
};
