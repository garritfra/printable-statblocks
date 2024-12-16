import yaml from "js-yaml";

export const fetchMonsterList = async () => {
  const response = await fetch("https://openrpg.de/srd/5e/de/api/monster");
  const data = await response.json();

  if (data.result && data.result.objects) {
    return data.result.objects.map((url: string) => {
      const name = url.split("/monster/")[1].split("/")[0];
      const displayName = name
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return {
        name: displayName,
        url: `https://openrpg.de/srd/5e/de/api/monster/${name}/fantasystatblocks.yaml`,
      };
    });
  }

  return [];
};

export const parseStatblock = (yamlContent: string) => {
  try {
    const match = yamlContent.match(/```statblock\n([\s\S]*?)```/);
    if (!match) {
      throw new Error("Could not find statblock content");
    }
    const cleanYaml = match[1].trim();
    return yaml.load(cleanYaml);
  } catch (error) {
    console.error("Error parsing YAML:", error);
    return null;
  }
};
