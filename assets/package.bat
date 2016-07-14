@ECHO OFF
:LOOP
CD ./
echo ">> Actualizando los paquetes a la ultima version..."
CALL ncu -m bower -u -p
CALL bower update --quiet
SET /P package1= Instalar paquete: 
CALL bower install %package1% --save --quiet
echo ">> %package1% ha sido instalado"
GOTO LOOP