export const SUBJECTS = Object.freeze({
	MATH: { NAME: 'Mathematical Reasoning', NOTION_PREFFIX: 'math' },
	READING: { NAME: 'Reading Comprehension', NOTION_PREFFIX: 'reading' },
	THINKING: { NAME: 'Thinking Skills', NOTION_PREFFIX: 'thinking' },
});

export const findSubjectNotionPrefixByName = (nameToFind: string): string | null => {
	const filteredSubjects = Object.values(SUBJECTS).filter((subject) => subject.NAME === nameToFind);
	if (filteredSubjects.length > 0) {
		return filteredSubjects[0].NOTION_PREFFIX;
	}
	return null; // Si no se encuentra el nombre, devuelve null
};
