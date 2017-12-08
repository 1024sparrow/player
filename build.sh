#!/bin/bash

appname=player
apppath=ru/traliva/player

#==========================

RED='\033[0;31m'
YEL='\033[1;33m'
NC='\033[0m'

function error_quite {
    echo -e "${RED}Сборка прервана из-за возникшей ошибки${NC}"
    exit 1
}

rm -rf build keystore.jks

#echo -e "${YEL}${NC}"
echo -e "${YEL}Создаём директории, куда будет производиться сборка${NC}"
mkdir -p build/gen build/obj build/apk || error_quite

echo -e "${YEL}Генерируем java-файлы (R.java), отображающие содержимое ресурсов (которые описаны в XML)${NC}"
"${BUILD_TOOLS}/aapt" package -f -m -J build/gen/ -S res -M AndroidManifest.xml -I "${PLATFORM}/android.jar" || error_quite

echo -e "${YEL}Собираем байт-код для нашего Java-приложения. Делаем байт-код для версии Java 7.${NC}"
javac -source 1.7 -target 1.7 -bootclasspath "${JAVA_HOME}/jre/lib/rt.jar" -classpath "${PLATFORM}/android.jar" -d build/obj build/gen/${apppath}/R.java java/${apppath}/MainActivity.java || error_quite
echo "Вот мы получили байт-код Java (файлы .class). Но Android использует байт-код другого формата - Dalvik (файлы .dex)"

echo -e "${YEL}Преобразуем стандартный байт-код в Андроидовский (Dalvik) байт-код${NC}"
"${BUILD_TOOLS}/dx" --dex --output=build/apk/classes.dex build/obj/ || error_quite

echo -e "${YEL}Запаковываем .dex-файлы, манифест и ресурсы в APK${NC}"
"${BUILD_TOOLS}/aapt" package -f -M AndroidManifest.xml -A assets -S res/ -I "${PLATFORM}/android.jar" -F build/${appname}.unsigned.apk build/apk/ || error_quite
echo "У нас есть apk-файл, но прежде чем его устанавливать на смартфон, его необходимо подписать..."

echo -e "${YEL}Делаем так, чтобы после распаковки нашего apk файлы были выровнены по размеру блока 4 байта${NC}"
"${BUILD_TOOLS}/zipalign" -f -p 4 build/${appname}.unsigned.apk build/${appname}.aligned.apk || error_quite

echo -e "${YEL}Генерируем ключ (будут запрашиваться данные у пользователя)${NC}"
keytool -genkeypair -keystore keystore.jks -alias androidkey -validity 10000 -keyalg RSA -keysize 2048 -storepass android -keypass android || error_quite

echo -e "${YEL}Подписываем полученным ключом наш apk${NC}"
"${BUILD_TOOLS}/apksigner" sign --ks keystore.jks --ks-key-alias androidkey --ks-pass pass:android --key-pass pass:android --out build/${appname}.apk build/${appname}.aligned.apk || error_quite
