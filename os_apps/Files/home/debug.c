// debug.c
#include <linux/kernel.h>
#include <linux/syscalls.h> // SYSCALL_DEFINE2
extern int __write_counter__;
SYSCALL_DEFINE0(debug) {
/* this pre-processor macro generates
* asmlinkage long sys_strcpy1(char *dest, char *src) {
* SYSCALL_DEFINE0 -> system call with zero argument
* SYSCALL_DEFINE1 -> system call with one argument
*/
// your code go here...
printk((const char *)__write_counter__);
return 1;
}
 
