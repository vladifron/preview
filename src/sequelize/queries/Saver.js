import fs from 'fs';
import path from 'path';

class Saver {
  processPath(dirname, filename) {
    const file = filename
      .split('.')
      .filter((one) => one !== 'js' && one !== 'ts')
      .join('.');
    return path.join(dirname, file + '.json');
  }
  getData(path) {
    try {
      const data = fs.readFileSync(path, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  saveData(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
  }

  processFile(dirname, filename, data) {
    const path = this.processPath(dirname, filename);

    let dataFromFile = this.getData(path);
    if (!dataFromFile) {
      this.saveData(path, data);
      dataFromFile = data;
    }

    return dataFromFile;
  }
}

export default new Saver();
