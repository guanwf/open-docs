
tar -zxvf jdk-8u151-linux-x64.tar.gz

#vi /etc/profile

在最后面加入

#set java environment
export JAVA_HOME=/usr/local/jdk1.8.0_151
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH

让配置生效
source /etc/profile 


检查版本
java -version
