# Proyecto de IA con Ollama

Este proyecto utiliza el modelo de IA **Ollama** configurado con **NestJS** y Docker. A continuación, se describen los pasos para clonar el repositorio, configurar el entorno y descargar el modelo.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instrucciones

### 1. Clonar el repositorio

Ejecuta el siguiente comando para clonar el repositorio en tu máquina local:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Luego, navega al directorio del proyecto:

```bash
cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
```

### 2. Construir el entorno con Docker Compose

Construye las imágenes y levanta los servicios utilizando el siguiente comando:

```bash
docker-compose up --build
```

### 3. Descargar el modelo **llama3** en el contenedor de Ollama

Una vez que los servicios estén en ejecución, accede al contenedor de Ollama para descargar el modelo **llama3**. Usa el siguiente comando para ingresar al contenedor:

```bash
docker exec -it <NOMBRE_DEL_CONTENEDOR_OLLAMA> bash
```

Dentro del contenedor, descarga el modelo utilizando la herramienta de Ollama:

```bash
ollama run llama3
```

Espera a que la descarga se complete. Este modelo será utilizado por el servicio para procesar solicitudes de IA.

### 4. Verificar que los servicios estén corriendo

Abre un navegador web o realiza una solicitud a la URL del servicio para confirmar que todo esté funcionando. Por ejemplo:

```bash
http://localhost:<PUERTO_DEL_SERVICIO>/status-server
http://localhost:<PUERTO_DEL_SERVICIO>/status-ia
```
