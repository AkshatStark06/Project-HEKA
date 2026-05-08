import json
from pathlib import Path
from typing import List, Dict, Any


class DataLoader:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)

    def load_json(self) -> List[Dict[str, Any]]:
        """
        Load and validate JSON dataset.
        """

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"Dataset not found: {self.file_path}"
            )

        try:
            with open(self.file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Invalid JSON format: {e}"
            )

        if isinstance(data, dict):

            if "patients" in data:
                data = data["patients"]

            else:
                raise ValueError(
                    "JSON object must contain 'patients' key"
                )
        if not isinstance(data, list):
            raise ValueError(
                "Dataset root must be a list of patients"
            )

        validated_data = []

        for idx, patient in enumerate(data):

            if not isinstance(patient, dict):
                print(f"Skipping invalid patient at index {idx}")
                continue

            # Add source traceability metadata
            patient["_source_index"] = idx

            validated_data.append(patient)

        return validated_data