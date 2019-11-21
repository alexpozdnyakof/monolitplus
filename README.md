#About

Настроенный webpack для сборки standalone страниц
Поддерживает автопрефиксинг из коробки, полифилинг кастомного css и еще некоторые возможности

#### 🖐 Requirements

Node:
 * NodeJS >= 10.x
 * NPM >= 6.x


#### ⏳ Build To Deploy

```bash
npm install
npm run build
````
на выходе получится ./dist/index.html
!После каждой сборки не нужно удалять ./dist, он удаляется автоматически

#### 🚀 Build To Dev

```bash
npm install
npm start
```

#Content

Для смены контента на странице, отредактируй файл

```
./src/content/home.json
```