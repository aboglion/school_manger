
def avgMarks(fn1):
    try:
        file1=open(fn1,'r')
        '''
        temp=fn1.split('.')
        fn2=temp[0]+'-report.'+temp[1]
        print(fn2)
       
        file2=open(fn2,'x')
        for x in file1:
            temp=x.split()
            marks=tuple(map(int,temp[1].split(',')))
            avg=0.0
            if len(marks)>0:
                avg=sum(marks)/len(marks)
            file2.write(temp[0]+' '+'{0:.1f}'.format(avg)+'\n')
        file1.close()
        '''
        file1.close()
    except FileNotFoundError:
        print('No input file')
    except FileExistsError:
        print('report file is found')
        file1.close()


avgMarks( r'C:\Users\Win10\Desktop\marks.txt')
