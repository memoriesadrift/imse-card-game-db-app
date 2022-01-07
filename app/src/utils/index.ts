export const onChangeWrapper = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fn: (item: string) => void) => {
    event.preventDefault()
    fn(event.target.value)
}
